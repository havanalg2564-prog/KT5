import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  find() {
    return this.reviewsService.find();
  }
  @Get('stats')
  aggregateReviews(@Query('minRating') minRating?: string) {
    const ratingThreshold = Number(minRating) || 1;
    return this.reviewsService.aggregateReviews(ratingThreshold);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.reviewsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto);
  }

  @Patch(':id')
  findByIdAndUpdate(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.findByIdAndUpdate(id, dto);
  }

  @Delete(':id')
  findByIdAndDelete(@Param('id') id: string) {
    return this.reviewsService.findByIdAndDelete(id);
  }
}