export const animations = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  
  slideIn: `
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
  
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `
};

export const applyAnimation = (element, animation, duration = '0.3s') => {
  element.style.animation = `${animation} ${duration} ease`;
};

// Hooks for animations
export const useAnimation = (ref, animation, duration = '0.3s') => {
  React.useEffect(() => {
    if (ref.current) {
      applyAnimation(ref.current, animation, duration);
    }
  }, [ref, animation, duration]);
};
