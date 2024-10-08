const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour must have less than or equal to 40 characters'],
        minlength: [10, 'A tour must have more than or equal to 10 characters'],
        // validate: [validator.isAlpha, 'Tour name must contain only characters']
    },
    slug: String,
    duration:{
        type: Number,
        required:[true,'A tour must have a duration']
    },
    maxGroupSize : {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty : {
        type: String,
        required: [true,'A tour must have a difficulty'],
        enum: {
            values:['easy','medium','hard'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default:4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default : 0
    },
    price:{
        type:Number,
        required:[true,'A tour must have a price']
    },
    priceDiscount :{
        type: Number,
        validate: {
            validator: function(val){
                return val < this.price;
            },
            message: 'Discount price should be below regular price ({VALUE})' //({VALUE}) is internal property of mongoose its value will be val  of above function;
        }
    },
    summary:{
        type: String,
        trim: true,
        required: [true,'A tour must have a description']
    },
    description:{
        type:String,
        trim: true
    },
    imageCover:{
        type: String,
        required: [true,'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secreatTour:{
        type: Boolean,
        default: false
    }
    },
    {
        toJSON: { virtuals: true },
        toObject: {virtuals: true}
    }
);

tourSchema.virtual('durationWeeks').get( function() {
    return this.duration / 7;
});// we cannot do operations on this since it is virtual it will be displayed on output

//4 types of middlewares in mongoose
//1)document mw
//2)query mw
//3)aggregate mw
//4)model mw

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{ lower: true});
    next();
});

// tourSchema.pre('save',function(next){
//     console.log('Will save Document...');
//     next();
// });

// tourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// })

//QUERY MIDDLEWARE: runs before or after certain query is executed
tourSchema.pre(/^find/,function(next){
    this.findOne({ secreatTour: { $ne:true } } );
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/,function(docs,next){
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
});

//AGGREGATION MIDDLEWARE: it allows us to add hooks before or after an aggregation happens
tourSchema.pre('aggregate',function(next){

    this.pipeline().unshift({ $match: { secreatTour: {$ne: true} } });
    next();
})

const Tour = mongoose.model('Tour',tourSchema);
module.exports = Tour;