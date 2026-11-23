import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
  ) {}

  find() {
    return this.reviewModel.find().exec();
  }

  async findById(id: string) {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }
    return review;
  }

  create(dto: CreateReviewDto) {
    return this.reviewModel.create(dto);
  }

  async findByIdAndUpdate(id: string, dto: UpdateReviewDto) {
    const review = await this.reviewModel
      .findByIdAndUpdate(id, dto, { new: true }) 
      .exec();
    
    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }
    return review;
  }

  async findByIdAndDelete(id: string) {
    const review = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }
    return review;
  }


  aggregateReviews(minRating = 1) {
    return this.reviewModel.aggregate([
      {
        $match: { 
          rating: { $gte: minRating } 
        },
      },
      {
        $group: {
          _id: '$userId',           
          count: { $sum: 1 },       
          avgRating: { $avg: '$rating' }, 
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
  }
}