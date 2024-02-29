const health = (req,res) => {
    return res.status(200).json({
        message:"Server is working"
    })
}

export{health}