import uuid

from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
)
from django.db import models
from django.utils.text import slugify

from accounts.models import User


class TimeStampedModel(models.Model):

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        abstract = True


# =========================================================
# Category
# =========================================================

class Category(TimeStampedModel):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.name)

        return super().save(*args, **kwargs)

    def __str__(self):

        return self.name


# =========================================================
# Brand
# =========================================================

class Brand(TimeStampedModel):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.name)

        return super().save(*args, **kwargs)

    def __str__(self):

        return self.name


# =========================================================
# Product
# =========================================================

class Product(TimeStampedModel):

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products'
    )

    brand = models.ForeignKey(
        Brand,
        on_delete=models.PROTECT,
        related_name='products'
    )

    name = models.CharField(
        max_length=200,
        unique=True
    )

    slug = models.SlugField(
        max_length=220,
        unique=True,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    specification = models.JSONField(
        default=dict,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    is_featured = models.BooleanField(
        default=False
    )

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.name)

        return super().save(*args, **kwargs)

    def __str__(self):

        return self.name


# =========================================================
# Variant Option
#
# Examples:
# Storage
# RAM
# Color
# ROM
# =========================================================

class VariantOption(TimeStampedModel):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True
    )

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.name)

        return super().save(*args, **kwargs)

    def __str__(self):

        return self.name


# =========================================================
# Variant Option Value
#
# Examples:
# 128GB
# 256GB
# Black
# Blue
# 8GB
# 16GB
# =========================================================

class VariantOptionValue(TimeStampedModel):

    option = models.ForeignKey(
        VariantOption,
        on_delete=models.CASCADE,
        related_name='values'
    )

    value = models.CharField(
        max_length=100
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=['option', 'value'],
                name='unique_option_value'
            )
        ]

    def __str__(self):

        return f'{self.option.name}: {self.value}'


# =========================================================
# Product Variant
# =========================================================

class ProductVariant(TimeStampedModel):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )

    sku = models.CharField(
        max_length=100,
        unique=True,
        blank=True
    )

    options = models.ManyToManyField(
        VariantOptionValue,
        related_name='product_variants',
        blank=True
    )

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[
            MinValueValidator(0)
        ]
    )

    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100)
        ]
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    is_default = models.BooleanField(
        default=False
    )

    is_active = models.BooleanField(
        default=True
    )

    @property
    def discounted_price(self):

        discount = (
            self.price *
            self.discount_percentage /
            100
        )

        return self.price - discount

    def save(self, *args, **kwargs):

        if not self.sku:

            self.sku = (
                f"{self.product_id}-"
                f"{uuid.uuid4().hex[:8].upper()}"
            )

        super().save(*args, **kwargs)

    def __str__(self):

        return f'{self.product.name} - {self.sku}'


# =========================================================
# Product Image
# =========================================================

class ProductImage(TimeStampedModel):

    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image = models.ImageField(
        upload_to='products/'
    )

    alt_text = models.CharField(
        max_length=200,
        blank=True
    )

    is_primary = models.BooleanField(
        default=False
    )

    display_order = models.PositiveIntegerField(
        default=0
    )

    def save(self, *args, **kwargs):

        if not self.alt_text:

            self.alt_text = (
                f'{self.variant.product.name} '
                f'{self.variant.sku} product image'
            )

        return super().save(*args, **kwargs)

    def __str__(self):

        return (
            f'{self.variant.product.name} '
            f'- {self.variant.sku} image'
        )


# =========================================================
# Product Question
# =========================================================

class ProductQuestion(TimeStampedModel):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='questions'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='product_questions'
    )

    question = models.TextField()

    answer = models.TextField(
        blank=True
    )

    is_approved = models.BooleanField(
        default=False
    )

    class Meta:

        ordering = ['-created_at']

    def __str__(self):

        return self.question


# =========================================================
# Product Review
# =========================================================

class ProductReview(TimeStampedModel):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='product_reviews'
    )

    rating = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )

    review = models.TextField()

    class Meta:

        ordering = ['-created_at']

        constraints = [
            models.UniqueConstraint(
                fields=['product', 'user'],
                name='unique_product_review'
            )
        ]

    def __str__(self):

        return f'{self.product.name} - {self.rating}/5'