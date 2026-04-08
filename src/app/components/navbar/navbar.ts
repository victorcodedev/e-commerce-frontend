import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { CartItem } from '../../interfaces/CartItem';
import { User } from '../../interfaces/User';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);

  @ViewChild('cartRef') cartRef!: ElementRef;
  @ViewChild('userRef') userRef!: ElementRef;

  cartOpen = signal(false);
  userOpen = signal(false);
  wishlistActive = signal(false);
  wishlistCount = signal(3);
  currentUser = signal<User | null>(null);
  searchQuery = signal('');
  cartItems = signal<CartItem[]>([]);
  cartCount = computed(() => this.cartItems().length);
  isLoggedIn = computed(() => this.currentUser() !== null);
  cartTotal = computed(() => this.cartItems().reduce((sum, item) => sum + item.price, 0));

  // --- Ações dos painéis ---
  toggleCart(): void {
    const isOpen = this.cartOpen();
    this.closeAll();
    this.cartOpen.set(!isOpen);
  }

  toggleUser(): void {
    const isOpen = this.userOpen();
    this.closeAll();
    this.userOpen.set(!isOpen);
  }

  toggleWishlist(): void {
    this.wishlistActive.update((v) => !v);
  }

  closeAll(): void {
    this.cartOpen.set(false);
    this.userOpen.set(false);
  }

  // Fecha os dropdowns ao clicar fora
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    const clickedInsideCart = this.cartRef?.nativeElement.contains(target);
    const clickedInsideUser = this.userRef?.nativeElement.contains(target);

    if (!clickedInsideCart && !clickedInsideUser) {
      this.closeAll();
    }
  }

  // --- Busca ---
  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/produtos'], { queryParams: { q: query } });
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.onSearch();
  }

  goToProfile(): void {
    this.closeAll();
    this.router.navigate(['/profile']);
  }

  goToOrders(): void {
    this.closeAll();
    this.router.navigate(['/orders']);
  }

  goToCheckout(): void {
    this.closeAll();
    this.router.navigate(['/checkout']);
  }

  // --- Formatação ---
  formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
