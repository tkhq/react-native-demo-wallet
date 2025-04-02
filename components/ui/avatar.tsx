import { View, Image } from "react-native";
import { cn } from "~/lib/utils";
import DefaultProfile from "~/assets/svgs/default-profile.svg";
import { FC } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  className?: string;
}

export const Avatar: FC<AvatarProps> = ({ src, alt, className }) => {
  return (
    <View
      className={cn(
        "h-10 w-10 rounded-full bg-white flex items-center justify-center overflow-hidden",
        className
      )}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          alt={alt}
          className="h-full w-full rounded-full"
        />
      ) : (
        <DefaultProfile width={20} height={20} />
      )}
    </View>
  );
};