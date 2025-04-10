import { Request, Response } from 'express';
import process from 'process';
import { AuthenticatedRequest } from '../utils/types/types';
import CompatibilityResult from '../models/Compatibility';
import { Dog } from '../interfaces/parkVisit.interface';


export const checkCompatibility = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const { myDog, otherDogs, parkId } = req.body;

  if (!myDog || !otherDogs || !Array.isArray(otherDogs) || !parkId) {
      res.status(400).json({ error: 'Faltan datos para calcular la compatibilidad' });
    return 
  }

  try {
    const prompt = generatePrompt(myDog, otherDogs);
    const completion = await callHuggingFace(prompt);
    const results = parseResponse(completion, otherDogs);

    await CompatibilityResult.create({
      user: authReq.user.id,
      park: parkId,
      myDog,
      results
    });

    res.status(200).json({ results });
    return 
  } catch (error) {
    console.error(' Error en compatibilidad IA:', error);
    res.status(500).json({ error: 'No se pudo calcular compatibilidad' });
    return 
  }
};

const generatePrompt = (myDog: Dog, otherDogs: Dog[]) => {
  const intro = `Mi perro se llama ${myDog.name} y es ${myDog.personality}.`;
  const descriptions = otherDogs.map(d => `El perro ${d.name} es ${d.personality}.`).join(' ');
  return `${intro} ${descriptions} Di cuánto de compatible es mi perro con cada uno del 0 al 100. Devuelve solo nombres y números.`;
};

const callHuggingFace = async (prompt: string) => {
    const response = await fetch(process.env.HF_MODEL as string, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: Number(process.env.HF_RES_MAX_LENGTH || 200),
          temperature: Number(process.env.HF_RES_TEMPERATURE || 0.7),
          top_p: Number(process.env.HF_RES_TOP_P || 0.9),
          return_full_text: false
        }
      })
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      console.error(' Error desde Hugging Face:', data);
      throw new Error(data.error || 'Fallo al generar texto');
    }
  
    const generated = data?.[0]?.generated_text;
    return generated || '';
  };
  ;

const parseResponse = (text: string, otherDogs: any[]) => {
  const results: { name: string; compatibility: number }[] = [];

  otherDogs.forEach(dog => {
    const regex = new RegExp(`${dog.name}\\D*(\\d{1,3})`, 'i');
    const match = text.match(regex);
    if (match) {
      const value = Math.min(parseInt(match[1]), 100);
      results.push({ name: dog.name, compatibility: value });
    } else {
      results.push({ name: dog.name, compatibility: 50 });
    }
  });

  return results;
};
