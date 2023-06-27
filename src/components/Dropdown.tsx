import { RefObject, useEffect, useRef, useState } from 'react'

type DropdownProps = {
  children: React.ReactNode
  content: React.ReactNode
}

function useHover<T extends HTMLDivElement>(): [RefObject<T>, boolean] {
  const [hovering, setHovering] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseEnter = () => {
      setHovering(true);
    };

    const handleMouseLeave = () => {
      setHovering(false);
    };

    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return [ref, hovering];
}

function Dropdown(props: DropdownProps) {
  const [ref, hovering] = useHover()

  return (
    <div
      ref={ref}
      className='relative'
    >
      {props.children}
      {hovering && (
        <div className='absolute top-full left-0 right-0'>
          <div className='mt-1 p-2 rounded bg-black bg-opacity-30'>
          {props.content}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown