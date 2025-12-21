
import React from 'react';

interface RubyRenderProps {
    baseText: React.ReactNode;
    reading: string;
    [key: string]: any; // Catch-all for extra props
}

export const RubyRender: React.FC<RubyRenderProps> = ({ baseText, reading, ...props }) => {
    // 1. Check separators: Middle Dot (・), Fullwidth Dot (．), Ideographic Period (。), Hyphen (-)
    // Note: Unicode \u00B7 is middle dot, \uFF0E is fullwidth dot.
    const separatorRegex = /[\u00B7\uFF0E\u3002\-]/;
    
    const parts = reading.split(separatorRegex);
    const textContent = typeof baseText === 'string' ? baseText : String(baseText || '');
    
    // If the base text is a string and its length matches the number of reading parts
    // We treat it as a 1-to-1 mapping
    const canMapOneToOne = textContent.length === parts.length && parts.length > 1;

    if (canMapOneToOne) {
        return (
            <ruby {...props} style={{ margin: '0 2px' }}>
                {textContent.split('').map((char, index) => (
                    <React.Fragment key={index}>
                        {char}
                        <rt>{parts[index]}</rt>
                    </React.Fragment>
                ))}
            </ruby>
        );
    }

    // Default: Render the whole reading over the whole base text
    return (
        <ruby {...props} style={{ margin: '0 2px' }}>
            {baseText}
            <rt>{reading}</rt>
        </ruby>
    );
};
