import React from 'react';

const LanguageHelpModal = ({ showLanguageHelp, setShowLanguageHelp, currentLanguage, supportedLanguages }) => {
  if (!showLanguageHelp) return null;
  
  const getLanguageInstructions = () => {
    switch(currentLanguage) {
      case 'ta':
        return (
          <div>
            <h3 className="font-bold mb-2">Typing in Tamil</h3>
            <p className="text-sm mb-2">You can type Tamil using either:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><strong>Virtual Keyboard:</strong> Click on the Tamil characters shown on the screen keyboard</li>
              <li><strong>Transliteration:</strong> Enable transliteration and type English letters that sound like Tamil words</li>
              <li><strong>System Keyboard:</strong> Set up Tamil input on your operating system</li>
            </ul>
            <div className="mt-4 p-2 bg-gray-100 rounded">
              <p className="text-sm font-semibold">Common transliterations:</p>
              <p className="text-sm">nandri = நன்றி (Thank you)</p>
              <p className="text-sm">vanakkam = வணக்கம் (Hello)</p>
              <p className="text-sm">tamil = தமிழ் (Tamil)</p>
            </div>
          </div>
        );
      case 'hi':
        return (
          <div>
            <h3 className="font-bold mb-2">Typing in Hindi</h3>
            <p className="text-sm mb-2">You can type Hindi using either:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><strong>Virtual Keyboard:</strong> Click on the Devanagari characters shown on the screen keyboard</li>
              <li><strong>Transliteration:</strong> Enable transliteration and type English letters that sound like Hindi words</li>
              <li><strong>System Keyboard:</strong> Set up Hindi input on your operating system</li>
            </ul>
            <div className="mt-4 p-2 bg-gray-100 rounded">
              <p className="text-sm font-semibold">Common transliterations:</p>
              <p className="text-sm">dhanyavaad = धन्यवाद (Thank you)</p>
              <p className="text-sm">namaste = नमस्ते (Hello)</p>
              <p className="text-sm">bhaarat = भारत (India)</p>
            </div>
          </div>
        );
      default:
        return <p className="text-sm">Select an Indian language to see typing instructions.</p>;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Typing Help - {supportedLanguages[currentLanguage]?.name}</h2>
          <button 
            onClick={() => setShowLanguageHelp(false)}
            className="p-1 rounded hover:bg-gray-200"
          >
            ×
          </button>
        </div>
        {getLanguageInstructions()}
        <button 
          onClick={() => setShowLanguageHelp(false)}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LanguageHelpModal;