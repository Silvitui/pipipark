import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements AfterViewInit {
  @Input() selectedPipican: { name: string; barrio: string } | null = null;
  @ViewChild('customModal') modalRef!: ElementRef<HTMLDialogElement>;

  ngAfterViewInit(): void {
    if (this.selectedPipican) {
      this.showModal();
    }
  }

  ngOnChanges(): void {
    if (this.modalRef && this.selectedPipican) {
      this.showModal();
    }
  }

  showModal() {
    console.log('Abriendo modal para:', this.selectedPipican);
    const modal = this.modalRef.nativeElement;
    if (modal) {
      modal.showModal();
    }
  }

  closeModal() {
    console.log('Modal cerrado');
    this.modalRef.nativeElement.close();
  }
}
