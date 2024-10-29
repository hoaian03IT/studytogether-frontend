import noImage from "../assets/default-featured-image.png";

export const loadImage = (url) => {
    if (!url) return noImage;
    return url;
};
