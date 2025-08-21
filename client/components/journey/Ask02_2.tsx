import { useState } from "react";

interface Ask02_2Props {
  sessionID: string | null;
  onNavigate: (screenId: string, data?: any) => void;
}

const Ask02_2 = ({ sessionID, onNavigate }: Ask02_2Props) => {
  const [textInput, setTextInput] = useState('');

  const handleNext = () => {
    // Log the user's text input to the console
    console.log('User other reason input:', textInput);
    console.log('Session ID:', sessionID);

    const data = { textInput };
    onNavigate('ask05', data);
  };

  return (
    <div className="theme-white min-h-screen">
      <div className="app-container py-8 animate-fade-in-up">
        {/* Question Section */}
        <div className="question-section">
          <h1 className="text-h2">
            อื่นๆ คืออะไร<br />
            ช่วยบอกเราหน่อยได้ไหม
          </h1>
        </div>

        {/* Encouragement text */}
        <div className="context-info">
          <p className="text-body text-center">
            ความคิดเห็นของคุณมีควา���สำคัญมากต่อการพัฒนาโยบาย
          </p>
        </div>

        {/* Text input area */}
        <div className="answer-section">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="กรุณาแบ่งปันความคิดเห็นของคุณ..."
            className="input-field h-32 resize-none"
            rows={4}
            aria-describedby="character-count"
          />
          <div id="character-count" className="text-right text-caption mt-2">
            {textInput.length} ตัวอักษร
          </div>
        </div>

        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-dots">
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 1 เสร็จสิ้น"></div>
            <div className="progress-dot completed" aria-label="ขั้นตอนที่ 2 เสร็จสิ้น"></div>
            <div className="progress-dot active" aria-label="ขั้นตอนที่ 3 กำลังดำเนินการ"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 4"></div>
            <div className="progress-dot inactive" aria-label="ขั้นตอนที่ 5"></div>
          </div>
          <p className="text-caption">ขั้นตอนที่ 3 จาก 5</p>
        </div>

        {/* Completion Zone */}
        <div className="completion-zone">
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={textInput.trim().length === 0}
            aria-describedby="next-button-description"
          >
            ไปต่อ
          </button>

          {textInput.trim().length === 0 && (
            <div id="next-button-description" className="status-message info mt-4">
              กรุณากรอกข้อความเพื่อดำเนินการต่อ
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="context-info">
          <h4 className="text-body font-bold text-text-primary mb-2">💡 ตัวอย่างความคิดเห็นที่เป็นประโยชน์:</h4>
          <ul className="text-caption text-text-secondary space-y-1">
            <li>• กังวลเรื่องผลกระทบต่อผู้มีรายได้น้อย</li>
            <li>• เห็นว่าควรมีระบบขนส่งสาธารณะที่ดีกว่าก่อน</li>
            <li>• ต้องการให้มีการศึกษา���ลกระทบเพิ่มเติม</li>
            <li>• มีข้อเสนอแนะเชิง���โยบาย</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Ask02_2;
