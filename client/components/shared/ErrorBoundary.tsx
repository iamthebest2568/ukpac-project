import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // swallow and log to console; do not rethrow
    console.error("ErrorBoundary caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold">มีข้อผิดพลาดในการโหลดหน้า</h2>
          <p className="mt-2 text-sm text-gray-600">โปรดลองรีเฟ��ชหน้า หรือกลับไปยังหน้าก่อนหน้า</p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              className="px-3 py-2 bg-[#000D59] text-white rounded"
              onClick={() => window.location.reload()}
            >
              รีเฟรช
            </button>
            <button
              className="px-3 py-2 bg-[#e5e7eb] text-black rounded"
              onClick={() => window.history.back()}
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
