import { IconType } from 'react-icons';
import { CgHome } from 'react-icons/cg';
import { AiOutlineBook, AiOutlineFileSearch } from 'react-icons/ai';
import { LuLayoutDashboard } from 'react-icons/lu';
import { FiHelpCircle } from 'react-icons/fi';
import { LiaRobotSolid } from 'react-icons/lia';

export interface NavItem {
  title: string;
  href: string;
  icon: IconType;
}

export const mainNav: NavItem[] = [
  {
    title: 'Inicio',
    href: '/dashboard',
    icon: CgHome,
  },
  {
    title: 'Repositorio Legal',
    href: '/dashboard/repositorio',
    icon: AiOutlineBook,
  },
  {
    title: 'Compliance',
    href: '/dashboard/compliance',
    icon: AiOutlineFileSearch,
  },
  {
    title: 'Panel de Actas',
    href: '/dashboard/panel-actas',
    icon: LuLayoutDashboard,
  },
  {
    title: 'Preguntas Frecuentes',
    href: '/dashboard/faq',
    icon: FiHelpCircle,
  },
  {
    title: 'Asistente Virtual',
    href: '/dashboard/asistenteia',
    icon: LiaRobotSolid,
  },
];
