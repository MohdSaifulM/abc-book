import { Document } from 'mongoose';

enum Genre {
    action_and_adventure = 'action_and_adventure', 
    art_architecture = 'art_architecture',
    alternate_history = 'alternate_history',  
    autobiography = 'autobiography',
    biography = 'biography',
    business_economics = 'business_economics',
    children = 'children',
    comicbook = 'comicbook',
    fantasy = 'fantasy',
    history = 'history',
    humor = 'humor',
    horror = 'horror',
    philosophy = 'philosophy',
    poetry = 'poetry',
    religion = 'religion',
    romance = 'romance',
    science_fiction = 'science_fiction',
    self_help = 'self_help',
    thriller = 'thriller',
    young_adult = 'young_adult',
    true_crime = 'true_crime'
}

export interface BookType extends Document {
    title: string,
    description: string,
    author: string,
    genre: Genre,
    year_published: string,
    borrowing_availability_status: boolean,
    last_borrower: string,
    quantity: number
}