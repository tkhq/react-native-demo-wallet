import * as React from 'react';
import { Text } from 'react-native';
import { Button, ButtonProps } from './button';
import { Spinner } from './spinner';
import { cn } from '~/lib/utils';

type LoaderButtonProps = ButtonProps & {
  loading?: boolean;
  children: React.ReactNode;
};

const LoaderButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  LoaderButtonProps
>(({ children, loading, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn('relative', className)}
      {...props}
      disabled={props.disabled || loading} // Disable button when loading
    >
      {loading && <Spinner size={18} className="absolute left-14 mx-auto" />}
      {children}
    </Button>
  );
});

LoaderButton.displayName = 'LoaderButton';

export { LoaderButton };
