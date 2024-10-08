
class APIFeatures{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        const queryObj = {...this.queryString};
        const excludeFields = ['page','sort','limit','fields'];//excluding these 4 from url
        excludeFields.forEach(el => delete queryObj[el]);

        //1B) Advemced filtering
        let queryStr  =  JSON.stringify(queryObj); 
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');//to solve case of tie we give another param
            this.query = this.query.sort(sortBy);
            //sort('price ratingsAverage') 
        }
        else{
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' '); 
            this.query = this.query.select(fields);
        }
        else{
            this.query = this.query.select('-__v'); //- is used to exclude, __v is internally used by mngoose we will not send it to user
        }

        return this;
    }

    paginate(){
        const page = this.queryString.page * 1 || 1; // *1 to convert to integer and || to set a default val
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
    
        return this;
    }
}

module.exports = APIFeatures;