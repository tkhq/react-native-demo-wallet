import {
  Content,
  ContentProps,
  ContentRef,
  Item,
  ItemProps,
  ItemRef,
  Overlay,
  Portal,
  Root,
  Separator,
  SeparatorProps,
  SeparatorRef,
  Trigger,
  useRootContext,
} from "@rn-primitives/dropdown-menu";
import React from "react";
import { StyleProp, ViewStyle, StyleSheet, Platform } from "react-native";
import { cn } from "~/lib/utils";
import { TextClassContext } from "./text";

export const DropdownMenu = Root;
export const DropdownMenuTrigger = Trigger;

export const DropdownMenuContent = React.forwardRef<
  ContentRef,
  ContentProps & {
    overlayStyle?: StyleProp<ViewStyle>;
    overlayClassName?: string;
    portalHost?: string;
  }
>(
  (
    { className, overlayClassName, overlayStyle, portalHost, ...props },
    ref
  ) => {
    const { open } = useRootContext();

    const resolvedOverlayStyle: ViewStyle | undefined = StyleSheet.flatten(
      [
        Platform.OS !== "web" ? StyleSheet.absoluteFill : undefined,
        overlayStyle,
      ].filter(Boolean)
    );

    return (
      <Portal hostName={portalHost}>
        <Overlay style={resolvedOverlayStyle} className={overlayClassName}>
          <Content
            ref={ref}
            className={cn(
              "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md shadow-foreground/5 web:data-[side=bottom]:slide-in-from-top-2 web:data-[side=left]:slide-in-from-right-2 web:data-[side=right]:slide-in-from-left-2 web:data-[side=top]:slide-in-from-bottom-2",
              open
                ? "web:animate-in web:fade-in-0 web:zoom-in-95"
                : "web:animate-out web:fade-out-0 web:zoom-out-95",
              className
            )}
            {...props}
          />
        </Overlay>
      </Portal>
    );
  }
);
DropdownMenuContent.displayName = Content.displayName;

export const DropdownMenuItem = React.forwardRef<
  ItemRef,
  ItemProps & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <TextClassContext.Provider value="select-none text-sm native:text-lg text-popover-foreground web:group-focus:text-accent-foreground">
    <Item
      ref={ref}
      className={cn(
        "relative flex flex-row web:cursor-default gap-2 items-center rounded-sm px-2 py-1.5 native:py-2 web:outline-none web:focus:bg-accent active:bg-accent web:hover:bg-accent group",
        inset && "pl-8",
        props.disabled && "opacity-50 web:pointer-events-none",
        className
      )}
      {...props}
    />
  </TextClassContext.Provider>
));
DropdownMenuItem.displayName = Item.displayName;

export const DropdownMenuSeparator = React.forwardRef<
  SeparatorRef,
  SeparatorProps
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = Separator.displayName;
