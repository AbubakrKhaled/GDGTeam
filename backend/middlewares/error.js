const errorhandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).json({message: err.message});
}

module.exports = errorhandler;