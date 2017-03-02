import mongoose from 'mongoose';

import MovieSchema from '../schemas/movie';

let Movie = mongoose.model('Movie', MovieSchema);

export default Movie;