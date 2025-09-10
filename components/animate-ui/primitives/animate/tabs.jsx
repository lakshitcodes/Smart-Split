'use client';;
import * as React from 'react';
import { motion } from 'motion/react';

import { Highlight, HighlightItem } from '@/components/animate-ui/primitives/effects/highlight';
import { getStrictContext } from '@/lib/get-strict-context';
import { Slot } from '@/components/animate-ui/primitives/animate/slot';

const [TabsProvider, useTabs] =
  getStrictContext('TabsContext');

function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  ...props
}) {
  const [activeValue, setActiveValue] = React.useState(defaultValue);
  const triggersRef = React.useRef(new Map());
  const initialSet = React.useRef(false);
  const isControlled = value !== undefined;

  React.useEffect(() => {
    if (
      !isControlled &&
      activeValue === undefined &&
      triggersRef.current.size > 0 &&
      !initialSet.current
    ) {
      const firstTab = triggersRef.current.keys().next().value;
      if (firstTab !== undefined) {
        setActiveValue(firstTab);
        initialSet.current = true;
      }
    }
  }, [activeValue, isControlled]);

  const registerTrigger = React.useCallback((val, node) => {
    if (node) {
      triggersRef.current.set(val, node);
      if (!isControlled && activeValue === undefined && !initialSet.current) {
        setActiveValue(val);
        initialSet.current = true;
      }
    } else {
      triggersRef.current.delete(val);
    }
  }, [activeValue, isControlled]);

  const handleValueChange = React.useCallback((val) => {
    if (!isControlled) setActiveValue(val);
    else onValueChange?.(val);
  }, [isControlled, onValueChange]);

  return (
    <TabsProvider
      value={{
        activeValue: (value ?? activeValue),
        handleValueChange,
        registerTrigger,
      }}>
      <div data-slot="tabs" {...props}>
        {children}
      </div>
    </TabsProvider>
  );
}

function TabsHighlight({
  transition = { type: 'spring', stiffness: 200, damping: 25 },
  ...props
}) {
  const { activeValue } = useTabs();

  return (
    <Highlight
      data-slot="tabs-highlight"
      controlledItems
      value={activeValue}
      transition={transition}
      click={false}
      {...props} />
  );
}

function TabsList(props) {
  return <div role="tablist" data-slot="tabs-list" {...props} />;
}

function TabsHighlightItem(props) {
  return <HighlightItem data-slot="tabs-highlight-item" {...props} />;
}

function TabsTrigger({
  ref,
  value,
  asChild = false,
  ...props
}) {
  const { activeValue, handleValueChange, registerTrigger } = useTabs();

  const localRef = React.useRef(null);
  React.useImperativeHandle(ref, () => localRef.current);

  React.useEffect(() => {
    registerTrigger(value, localRef.current);
    return () => registerTrigger(value, null);
  }, [value, registerTrigger]);

  const Component = asChild ? Slot : motion.button;

  return (
    <Component
      ref={localRef}
      data-slot="tabs-trigger"
      role="tab"
      onClick={() => handleValueChange(value)}
      data-state={activeValue === value ? 'active' : 'inactive'}
      {...props} />
  );
}

function TabsContents({
  children,
  style,

  transition = {
    type: 'spring',
    stiffness: 300,
    damping: 32,
    bounce: 0,
    restDelta: 0.01,
  },

  ...props
}) {
  const { activeValue } = useTabs();
  const childrenArray = React.useMemo(() => React.Children.toArray(children), [children]);
  const activeIndex = React.useMemo(() =>
    childrenArray.findIndex(child => React.isValidElement(child) &&
    typeof child.props === 'object' &&
    child.props !== null &&
    'value' in child.props &&
    child.props.value === activeValue), [childrenArray, activeValue]);

  return (
    <div
      data-slot="tabs-contents"
      style={{ overflow: 'hidden', ...style }}
      {...props}>
      <motion.div
        style={{ display: 'flex', marginInline: '-20px' }}
        animate={{ x: activeIndex * -100 + '%' }}
        transition={transition}>
        {childrenArray.map((child, index) => (
          <div
            key={index}
            style={{ width: '100%', flexShrink: 0, paddingInline: '20px' }}>
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function TabsContent({
  value,
  style,
  asChild = false,
  ...props
}) {
  const { activeValue } = useTabs();
  const isActive = activeValue === value;

  const Component = asChild ? Slot : motion.div;

  return (
    <Component
      role="tabpanel"
      data-slot="tabs-content"
      style={{ overflow: 'hidden', ...style }}
      initial={{ filter: 'blur(0px)' }}
      animate={{ filter: isActive ? 'blur(0px)' : 'blur(4px)' }}
      exit={{ filter: 'blur(0px)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      {...props} />
  );
}

export { Tabs, TabsList, TabsHighlight, TabsHighlightItem, TabsTrigger, TabsContents, TabsContent, useTabs };
