import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Button = () => {
    return (
        <Link href="/membership" aria-label="Click Here to Become a Member">
            <div className="absolute -bottom-20 right-20 sm:-bottom-18 sm:right-28 h-30 w-30 sm:w-40  sm:h-40 md:w-45 md:h-45 z-20 pointer-events-none">
                <Image
                    src="/hero_stock/click-here-button.png"
                    alt="Click-Here"
                    fill
                    className="object-contain"
                />
            </div>
        </Link>
    );
};

export default Button;