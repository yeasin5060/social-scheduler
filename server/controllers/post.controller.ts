import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { cloudinary } from "../config/cloudinary.js";
import { Generation } from "../models/Generation.model.js";

//Helper to pll leonardo.ai

const pollLeonardoJob = async (generationId : string, apiKey : string) : Promise<string> => {
    const maxRetries = 20;
    const delay = 5000;

    for(let i = 0 ; i < maxRetries ; i++){
        try {
            const response = await axios.get(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,{headers : {
                accept : 'application/json',
                authorization : `Bearer ${apiKey}`
            }});

            const generation = response.data.generations_by_pk;
            if(generation.status === "COMPLETE"){
                if(generation.generated_images && generation.generated_images.length > 0){
                    return generation.generated_images[0].url;
                }
                throw new Error('Generate complete but no images found');
            }

            if(generation.status === "FAILED"){
                throw new Error('Generate complete but no images found');
            }
        } catch (error : any) {
            console.log('Polling Error', error?.response?.data || error?.message)
        }
    }
}

// Generate Post
//Post /api/posts/generate

export const generatePost = async (req: AuthRequest , res : Response) : Promise <void> => {
    try {
        const {tone , prompt , generateImage} = req.body;

        const apiKey = process.env.GEMINI_API_KEY;

        if(!apiKey){
            res.status(400).json({message : "Gemini Api key is missing.please add it to your server/.env file"});
            return ;
        }

        const ai = new GoogleGenAI({apiKey});

        const textResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents : `Generate a social midea post based on this prompt: "${prompt}".Tone : ${tone}.Include relevant hashtag.
            Format the response as JSON with "contant" and "imagePrompt" fields.
            The "imagePrompt" should be a highly descriptive prompt for an image generator that complements post.`,
        });

        let content = "";
        let imageprompt = prompt;

        try {
            const rawText = textResponse.text || '';
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {content : rawText, imageprompt : prompt};
            content = data.content;
            imageprompt = data.imagePrompt;
        } catch (e) {
            content = textResponse.text || "";
        }

        let mideaUrl = "";
        if(generateImage){
            try {
                const leonardokey = process.env.LEONARDO_API_KRY;
                if(leonardokey){
                    //Use Leonardo.AI for image generation
                    const leoResponse = await axios.post(
                        'https://cloud.leonardo.ai/api/rest/v2/generations',

                        {
                            "public": false,
                            "model": "gpt-image-1.5",
                            "parameters":{
                                "quality": "LOW",
                                "prompt": imageprompt,
                                "quantity":1,
                                "width": 1024,
                                "height": 1024,
                                "seed": 4294967295,
                                "prompt_enhance": "OFF"
                            }
                        },{
                            headers : {
                                accept : 'application/json',
                                authorization : `Bearer ${leonardokey}`,
                                'content-type' : 'application/json',
                            }
                        }
                    );
                    const generationId = leoResponse.data.generate.generationId;
                    const tempUrl = await pollLeonardoJob(generationId , leonardokey);
                        //Upload to cloudinary for presistence
                    const uploadResult = await cloudinary.uploader.upload(tempUrl , {
                        folder : 'ai-generations'
                    });
                    mideaUrl = uploadResult.secure_url;
                }
            } catch (err : any) {
                console.error('Image generation failed:',err);
            }
        }

        // save generation to db
        const generation = await Generation.create({
            user : req.user._id,
            prompt,
            content,
            mediaUrl : mideaUrl,
            mediaType : mideaUrl ? "image" : undefined,
            tone
        });
        res.json(generation)
    } catch (error:any) {
        res.status(500).json({ message : error?.message || "Server Error" });
    }
} 

// Get Generations
//Get /api/posts/generations

export const getGenerations = async (req: AuthRequest , res : Response) : Promise <void> => {
    try {
        const generations = await Generation.find({user:req.user._id}).sort({createdAt:-1});
        res.json(generations)
    } catch (error:any) {
        res.status(500).json({ message : error?.message || "Server Error" });
    }
} 

// Get Posts
//Get /api/posts

export const getPosts = async (req: AuthRequest , res : Response) : Promise <void> => {
    
} 