const Tour = require('./../model/tourModel');
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


exports.getAllTours = async (req,res) =>{

    //BUILD QUERY
    //1A)Filtering
    const queryObj = {...req.query};
    const excludeFields = ['page','sort','limit','fields'];//excluding these 4 from url
    excludeFields.forEach(el => delete queryObj[el]);

    //1B) Advemced filtering
    let queryStr  =  JSON.stringify(queryObj); 
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    //2)Sorting
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');//to solve case of tie we give another param
        query = query.sort(sortBy);
        //sort('price ratingsAverage') 
    }
    else{
        query = query.sort('-createdAt');
    }

    //3) field limiting
    if(req.query.fields){
        const fields = req.query.fields.split(',').join(' '); 
        query = query.select(fields);
    }
    else{
        query = query.select('-__v'); //- is used to exclude, __v is internally used by mngoose we will not send it to user
    }

    //EXECUTE QUERY
    const tours = await query;

    //SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data : {
            tours
        }
    });
};
exports.getTour = async (req,res)=>{

    try{
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status : 'success',
            data: {
                tour
            }
        });
    }
    catch(err){
        res.status(400).json({
            status: 'fail',
            message : err
        })
    }
}

exports.createTour = async (req,res) =>{
    try{
        const newTour = await Tour.create(req.body);

    res.status(201).json({
        status:'success',
        data :{
            tour : newTour
        }
    });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message : err
        })
    }
    

}
exports.updateTour = async (req,res) =>{
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        })
        
        res.status(200).json({
            status:'success',
            data: {
                tour
            }
        });
    }
    catch(err){
        res.status(404).json({
            status: fail,
            message: err
        });
    }
    
}
exports.deleteTour =async (req,res) =>{

    try{
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status:'success',
            data: null
        });  
    }
    catch(err){
        res.status(404).json({
            status:fail,
            message:err
        });
    }
    
}
