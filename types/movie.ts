import { Showing } from './showing';

export interface Movie {
    id: number;
    title: string;
    preview_img: string;
    preview_img_alt: string;
    description: string;
    showings: Showing[];
    // reviews: Review[];
}

export interface NewMovie {
    title: string;
    preview_img: string;
    preview_img_alt: string;
    description: string;
}
