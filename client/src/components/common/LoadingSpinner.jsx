const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClass = `loading-${size}`;
  return (
    <div className={sizeClass}>
      <span></span>
    </div>
  );
};
export default LoadingSpinner;
