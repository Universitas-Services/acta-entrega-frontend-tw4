import { IconType } from 'react-icons';
import { CgHome } from 'react-icons/cg';
import { AiOutlineBook, AiOutlineFileSearch } from 'react-icons/ai';
import { LuLayoutDashboard } from 'react-icons/lu';
import { FiHelpCircle } from 'react-icons/fi';
import { LiaRobotSolid } from 'react-icons/lia';
import { IoCreateOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';

export interface NavItem {
  title: string;
  href: string;
  icon?: IconType;
  subItems?: NavItem[];
  id: string;
  src?: string;
}

// --- Interfaz para Sub-items (sin icono) ---
export interface NavSubItem {
  title: string;
  href: string;
  id: string;
}

export const mainNav: NavItem[] = [
  {
    id: 'main-inicio',
    title: 'Inicio',
    href: '/dashboard',
    icon: CgHome,
  },
  {
    id: 'main-repositorio',
    title: 'Repositorio legal',
    href: '/dashboard/repositorio',
    icon: AiOutlineBook,
  },
  {
    id: 'main-compliance',
    title: 'Compliance',
    href: '/dashboard/compliance',
    icon: AiOutlineFileSearch,
  },
  {
    id: 'main-panel-actas',
    title: 'Panel de actas',
    href: '/dashboard/panel-actas',
    icon: LuLayoutDashboard,
  },
  {
    id: 'main-faq',
    title: 'Preguntas frecuentes',
    href: '/dashboard/faq',
    icon: FiHelpCircle,
  },
  {
    id: 'main-asistente',
    title: 'Consultor IA',
    href: '/dashboard/asistenteia',
    icon: LiaRobotSolid,
  },
];

// Links específicos para usuarios Pro
export const proNav: NavItem[] = [
  {
    id: 'pro-inicio',
    title: 'Elaboración',
    href: '/dashboard/pro',
    icon: IoCreateOutline,
  },
  {
    id: 'pro-compliance',
    title: 'Compliance',
    href: '/dashboard/actas-pro/compliance',
    icon: IoShieldCheckmarkOutline,
  },
  {
    id: 'pro-panel-actas',
    title: 'Panel de actas',
    href: '#', // El padre no navega
    icon: LuLayoutDashboard,
    subItems: [
      {
        id: 'pro-elaboracion-panel',
        title: 'Elaboración',
        href: '/dashboard/panel-de-actas/elaboracion', // Ruta del Panel Elaboración
        icon: IoCreateOutline, // Ícono de "Elaboración"
      },
      {
        id: 'pro-compliance-panel',
        title: 'Compliance',
        href: '/dashboard/panel-de-actas/compliance', // Ruta del Panel Compliance
        icon: IoShieldCheckmarkOutline, // Ícono de "Compliance"
      },
    ],
  },
  {
    id: 'pro-repositorio',
    title: 'Repositorio legal',
    href: '/dashboard/repositorio-pro',
    icon: AiOutlineBook,
  },
  {
    id: 'pro-asistencia-usuario',
    title: 'Asistencia al usuario',
    href: '/dashboard/asistencia-usuario',
    icon: FiHelpCircle,
  },
  {
    id: 'pro-asistente',
    title: 'Consultor IA',
    href: '/dashboard/consultoria',
    icon: LiaRobotSolid,
  },
  {
    id: 'pro-conocenos',
    title: 'Conócenos',
    href: '/dashboard/conocenos-pro',
    src: '/Icono - trazo - universitas.png',
  },
];
