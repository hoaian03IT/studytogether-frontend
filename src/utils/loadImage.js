import noImage from "../../public/default-featured-image.png";

export const loadImage = (url) => {
    if (!url) return noImage;
    return url;
};
