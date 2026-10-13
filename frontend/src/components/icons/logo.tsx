import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

// NullHawk emblem: a hawk cut out of a shield, drawn as one even-odd path so it
// renders in a single color (inherits currentColor) and stays legible at favicon size.
function Logo({ className, ...props }: LogoProps) {
    return (
        <svg
            className={cn(className)}
            fill="currentColor"
            viewBox="0 0 160 160"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                clipRule="evenodd"
                d="M80 12 L144 34 L144 84 C144 114 116 136 80 150 C44 136 16 114 16 84 L16 34 Z M80 36 L74 46 L80 52 L86 46 Z M76 56 L44 44 L58 60 L38 56 L62 74 L76 72 Z M84 56 L116 44 L102 60 L122 56 L98 74 L84 72 Z M73 70 L87 70 L84 108 L80 124 L76 108 Z"
                fillRule="evenodd"
            />
        </svg>
    );
}

export default Logo;
