import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { IoVolumeHigh } from "react-icons/io5";

const FlashCard = () => {
    const vocabularyList = [
        { front: "snake", back: "Lê Duy ,Đặng An lũ rắn độc" },
        { front:  "Hello", back: "xin chào" },
        { front: "collect", back: "thu thập" },
        { front: "milk tea", back: "trà sữa" },
        { front: "notebook", back: "vở" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        setIsFlipped(false);
        if (currentIndex < vocabularyList.length - 1) {
            setCurrentIndex(currentIndex + 1);

        }
    };

    const handleBack = () => {
        setIsFlipped(false);
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const speakText = (text, e) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

	const speakText1 = (text, e) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f4f6f8',
        }}>
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                {/* Front Side */}
                <div
                    onClick={handleFlip}
                    style={{
                        width: '600px',
                        height: '400px',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '20px',
                        position: 'relative',
                    }}
                >
                    <IoVolumeHigh
                        onClick={(e) => {
                            e.stopPropagation();
                            speakText(vocabularyList[currentIndex].front, e);
                        }}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            fontSize: '24px',
                            color: '#007bff',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease',
                        }}
                        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <p style={{
                        fontSize: '24px',
                        color: '#007bff',
                        fontWeight: '500',
                        textAlign: 'center',
                    }}>
                        {vocabularyList[currentIndex].front}
                    </p>
                </div>

                {/* Back Side */}
                <div
                    onClick={handleFlip}
                    style={{
                        width: '600px',
                        height: '400px',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '20px',
                        position: 'relative',
                    }}
                >
                    <IoVolumeHigh
                        onClick={(e) => {
                            e.stopPropagation();
                            speakText1(vocabularyList[currentIndex].back, e);
                        }}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            fontSize: '24px',
                            color: '#007bff',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease',
                        }}
                        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <p style={{
                        fontSize: '24px',
                        color: '#007bff',
                        fontWeight: '500',
                        textAlign: 'center',
                    }}>
                        {vocabularyList[currentIndex].back}
                    </p>
                </div>
            </ReactCardFlip>

            <div style={{ marginTop: '30px' }}>
                <button
                    onClick={handleBack}
                    disabled={currentIndex === 0}
                    style={{
                        marginRight: '10px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentIndex === 0 ? 0.5 : 1,
                    }}
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === vocabularyList.length - 1}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: currentIndex === vocabularyList.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentIndex === vocabularyList.length - 1 ? 0.5 : 1,
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default FlashCard;
