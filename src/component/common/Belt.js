import React, { useState } from 'react';

export default function Belt() {
  const [color] = useState('#000000');
  return (
    <>
      <div className="box-belt">
        <div
          className="box-belt-dot"
          style={{ backgroundColor: `${color}` }}
        />
        <span>Đai đen</span>
      </div>
    </>
  );
}
