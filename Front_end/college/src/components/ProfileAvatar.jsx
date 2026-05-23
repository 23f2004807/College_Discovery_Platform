import { getProfileIconOption, DEFAULT_PROFILE_ICON } from '../models/profileIcons';

export default function ProfileAvatar({ iconId, size = 'md', className = '' }) {
  const { Icon } = getProfileIconOption(iconId || DEFAULT_PROFILE_ICON);
  const dim = size === 'lg' ? 'h-5 w-5' : size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const box = size === 'lg' ? 'p-2.5' : size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <span
      className={`d-inline-flex align-items-center justify-content-center rounded-circle bg-sky-500/20 border border-sky-400/40 ${box} ${className}`}
    >
      <Icon className={`${dim} text-sky-300`} />
    </span>
  );
}
