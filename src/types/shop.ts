export interface Product {
    id: number;
    name: string;
    price: number;
    images: string[];
    category?: string;
    sizes: string[];
    colors: string[];
}

export interface CartItem extends Product {
    quantity: number;
    size?: string;
    color?: string;
}

export type ShoeData = Record<string, Product[]>;