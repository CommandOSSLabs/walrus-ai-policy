import { type ImgHTMLAttributes } from "react";
import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";

interface JazziconProps extends ImgHTMLAttributes<HTMLDivElement> {
  address: string;
}

export default ({ address, ...rest }: JazziconProps) => {
  const src = createAvatar(identicon, {
    seed: address,
    radius: 100,
  }).toDataUri();

  return <img src={src} alt={src} {...rest} />;
};
