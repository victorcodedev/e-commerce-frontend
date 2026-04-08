import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'home',
  standalone: true,
  imports: [Navbar, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
