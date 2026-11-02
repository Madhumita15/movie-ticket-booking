const { getUserProfileService, updateUserProfileService } = require("../service/user.service")
const httpStatusCode = require("../utils/httpStatusCode")

class UserController{

    async getProfile(req, res){
        const userId = req.user._id
        const {user, source} = await getUserProfileService(userId)
        return res.status(httpStatusCode.OK).json({
            success: true,
            message: "User get successfully!",
            source: source,
            data: {
                name: user.name,
                email: user.email,
                profile_image: user.profile_image,
                phone: user.phone,
                _id: user._id

            }
        })
    }

    async updateProfile(req, res){
        const userId = req.user._id
        const {name, phone} = req.body
        const file = req.file
        const user = await updateUserProfileService({name, phone, file, userId})
         return res.status(httpStatusCode.OK).json({
            success: true,
            message: "User updated successfully!",
            data: {
                name: user.name,
                email: user.email,
                profile_image: user.profile_image,
                phone: user.phone,
                _id: user._id

            }
        })


    }

}

module.exports = new UserController()