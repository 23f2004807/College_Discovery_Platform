import {
  User, GraduationCap, BookOpen, Atom, Heart, Star, Rocket, Briefcase, Palette, Microchip,
} from 'lucide-react';

export const PROFILE_ICON_OPTIONS = [
  { id: 'user', label: 'User', Icon: User },
  { id: 'graduation-cap', label: 'Graduate', Icon: GraduationCap },
  { id: 'book-open', label: 'Scholar', Icon: BookOpen },
  { id: 'atom', label: 'Science', Icon: Atom },
  { id: 'heart', label: 'Passion', Icon: Heart },
  { id: 'star', label: 'Star', Icon: Star },
  { id: 'rocket', label: 'Ambition', Icon: Rocket },
  { id: 'briefcase', label: 'Career', Icon: Briefcase },
  { id: 'palette', label: 'Arts', Icon: Palette },
  { id: 'microchip', label: 'Tech', Icon: Microchip },
];

export const PROFILE_ICON_IDS = PROFILE_ICON_OPTIONS.map((o) => o.id);

export const DEFAULT_PROFILE_ICON = 'user';

export function getProfileIconOption(iconId) {
  return PROFILE_ICON_OPTIONS.find((o) => o.id === iconId)
    || PROFILE_ICON_OPTIONS[0];
}
