import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const subscriberId = req.user?._id
    // TODO: toggle subscription

    if (!channelId) {
        throw new ApiError(400, "no channel id found")
    }

    if (!subscriberId) {
        throw new ApiError(400, "no subscriber's id found")
    }

    if (channelId.toString() === subscriberId.toString()) {
        throw new ApiError(401, "you cannot subscribe to your own channel")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    })

    let message = ""

    if (existingSubscription) {
        await existingSubscription.deleteOne()

        return res.status(200).json(
            new ApiResponse(
                200,
                { subscribed: false },
                "Unsubscribed successfully"
            )
        )
    }

    await Subscription.create({
        channel: channelId,
        subscriber: subscriberId,
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            { subscribed: true },
            "Subscribed successfully"
        )
    )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!channelId) {
        throw new ApiError(400, "channel id not found")
    }

    const subscriberList = await Subscription.find({
        channel: channelId
    }).populate("subscriber", "fullName avatar")

    if (subscriberList.length === 0) {
        return res.status(200).json(new ApiResponse(200, "No Subscriber"))
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    count: subscriberList.length,
                    subscriberList
                },
                "Subscribers list fetched successfully"
            )
        )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!subscriberId) {
        throw new ApiError(400, "no subscriber's id found")
    }

    const channelsSubscribed = await Subscription.find({
        subscriber: subscriberId
    }).populate("channel", "username avatar")

    if (channelsSubscribed.length === 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    channelsSubscribed,
                    "No channels subscribed"
                )
            )
    }

    return res
        .status(201)
        .json(new ApiResponse(
            200,
            {
                count: channelsSubscribed.length,
                channelsSubscribed,
            },
            "Subscribed Channels fetched successfully"
        ))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}