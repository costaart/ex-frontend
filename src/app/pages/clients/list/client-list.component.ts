import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ClientService } from '../client.service';
import { Client } from '../client.model';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'client-list.component.html',
  styleUrls: ['client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  page = 1;
  perPage = 10;
  hasNextPage = false;
  searchTerm = '';
  isLoading = false;
  isAdmin = false;

  constructor(
    private clientService: ClientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole(['ADMIN']);
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.clientService.getAll(this.page, this.perPage, this.searchTerm).subscribe({
      next: (res) => {
        
        this.clients = res.data;
        this.hasNextPage = res.hasNextPage;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.page = 1;
    this.loadClients();
  }

  nextPage() {
    if (this.hasNextPage) {
      this.page++;
      this.loadClients();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadClients();
    }
  }

  onDelete(id: string) {
    Swal.fire({
      title: 'Excluir Cliente?',
      text: 'Essa ação é irreversível!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.delete(id).subscribe(() => {
          Swal.fire('Excluído!', 'Cliente removido.', 'success');
          this.loadClients();
        });
      }
    });
  }
}