import { useEffect, useRef, useState } from "react";

export function useAutoScroll(dependencies: any[]) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  // Detect manual scroll
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    setIsAutoScrollEnabled(isAtBottom);
  };

  // Scroll to bottom when dependencies change (like new messages)
  useEffect(() => {
    if (isAutoScrollEnabled && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [...dependencies, isAutoScrollEnabled]);

  return { containerRef, bottomRef, handleScroll, isAutoScrollEnabled };
}
