import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'client-form.component.html',
  styleUrls: ['client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  clientData = {
    razaoSocial: '',
    cnpj: '',
    email: ''
  };
  
  clientId: string | null = null;
  isEditMode = false;
  isLoading = false;
  isSearchingCnpj = false; 

  constructor(
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    if (this.clientId) {
      this.isEditMode = true;
      this.loadClient(this.clientId);
    }
  }

  loadClient(id: string) {
    this.isLoading = true;
    this.clientService.getById(id).subscribe({
      next: (response: any) => {
        const data = response.client;

        this.clientData = {
          razaoSocial: data.razaoSocial,
          cnpj: data.cnpj,
          email: data.email
        };
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.router.navigate(['/clientes']);
      }
    });
  }

  buscarCnpj() {
    const cnpjLimpo = this.clientData.cnpj.replace(/\D/g, '');

    if (cnpjLimpo.length !== 14) return; 

    this.isSearchingCnpj = true;
    
    this.clientService.consultarCnpj(cnpjLimpo).subscribe({
      next: (res: any) => {
        this.clientData.razaoSocial = res.razao_social;
        
        if (!this.clientData.email && res.email) {
           this.clientData.email = res.email;
        }

        this.isSearchingCnpj = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'CPNJ encontrado!',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: () => {
        this.isSearchingCnpj = false;
        Swal.fire('Erro', 'CNPJ não encontrado.', 'error');
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    const action$ = this.isEditMode && this.clientId
      ? this.clientService.update(this.clientId, this.clientData)
      : this.clientService.create(this.clientData);

    action$.subscribe({
      next: () => {
        Swal.fire('Sucesso', 'Cliente salvo com sucesso!', 'success');
        this.router.navigate(['/clientes']);
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erro', 'Falha ao salvar cliente.', 'error');
      }
    });
  }
}