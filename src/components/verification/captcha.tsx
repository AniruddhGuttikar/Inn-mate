'use client'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

interface CaptchaProps {
    setDel: (value: boolean) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ setDel }) => {
    const [captcha, setCaptcha] = useState<string | null>(null);

    const onSubmit = () => {
        if (captcha) {
            console.log("Captcha verified");
            setDel(true); // Notify parent component that captcha is verified
        } else {
            alert("Please complete the CAPTCHA verification.");
        }
    };

    return (
        <div>
            <ReCAPTCHA
                sitekey="6Lftwm0qAAAAACcpDNPVuN-50LYdpJci3fMYEn3L"
                onChange={(value) => {
                    setCaptcha(value);
                    if (value) onSubmit(); 
                }}
            />
        </div>
    );
};

export default Captcha;
