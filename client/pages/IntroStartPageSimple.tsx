const IntroStartPageSimple = () => {
  const handleStart = () => {
    console.log("Start button clicked");
    // For now just console log, later we'll add navigation
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#000",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      textAlign: "center"
    }}>
      <h1 style={{
        fontSize: "24px",
        marginBottom: "40px",
        lineHeight: "1.4"
      }}>
        แล้วถ้าหากวันหนึ่งมี<br/>
        การเก็บค่าธรรมเนียม<br/>
        เพื่อแก้ไขปัญหาจราจร<br/>
        จะเป็นอย่างไร...
      </h1>
      
      <button 
        onClick={handleStart}
        style={{
          backgroundColor: "#EFBA31",
          color: "black",
          border: "1.5px solid black",
          borderRadius: "40px",
          padding: "15px 30px",
          fontSize: "18px",
          fontWeight: "500",
          cursor: "pointer",
          minWidth: "200px"
        }}
      >
        เริ่มเล่น
      </button>
    </div>
  );
};

export default IntroStartPageSimple;
