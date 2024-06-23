import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#3A3A3A] group-[.toaster]:text-foreground group-[.toaster]:border-[#FF6B6B] group-[.toaster]:border-[2px] group-[.toaster]:text-[14px] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
