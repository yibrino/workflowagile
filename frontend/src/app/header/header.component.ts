// src/app/header/header.component.ts
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

interface MenuItem {
  label: string;
  link?: string;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  activeLink: string = 'Home';
  menuItems: MenuItem[] = [
    {
      label: 'Home',
      link: '/',
    },
    {
      label: 'create Question',
      link: 'question-creation',
    },

    {
      label: 'Browse Questions',
      link: 'jsonquestions',
    },
    // {
    //   label: 'New exam',
    //   link: 'new_exam',
    // },
    {
      label: 'Exam list',
      link: 'examlists',
    },
    // {
    //   label: 'Monitoring/Results',
    //   link: 'monitoring_results',
    // },

    {
      label: 'Contact',
      link: 'contactus',
    },
  ];

  @ViewChild('headerRef', { static: true }) headerRef!: ElementRef;
  @ViewChild('menuRef', { static: true }) menuRef!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (scrollPosition > 80) {
      this.renderer.addClass(this.headerRef.nativeElement, 'header__shrink');
    } else {
      this.renderer.removeClass(this.headerRef.nativeElement, 'header__shrink');
    }
  }

  toggleMenu() {
    this.renderer.addClass(this.menuRef.nativeElement, 'menu__active');
  }

  setActiveLink(label: string) {
    this.activeLink = label;
  }

  setSubmenuActiveLink(submenu: any, label: string) {
    submenu.activeLink = label;
  }
}
