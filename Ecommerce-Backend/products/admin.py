from django.contrib import admin
from django.utils.html import format_html

from .models import (
    Category,
    Brand,
    Product,
    VariantOption,
    VariantOptionValue,
    ProductVariant,
    ProductImage,
    ProductQuestion,
    ProductReview,
)
admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(VariantOption)
admin.site.register(VariantOptionValue)
admin.site.register(ProductQuestion)
admin.site.register(ProductReview)


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        'variant',
        'is_primary',
        'display_order',
        'created_at',
    ]

    list_filter = [
        'is_primary',
    ]

    ordering = [
        'variant',
        'display_order',
    ]


class ProductImageInline(admin.TabularInline):

    model = ProductImage

    extra = 1

    fields = [
        'image',
        'alt_text',
        'is_primary',
        'display_order',
    ]

    readonly_fields = [
        'alt_text',
    ]


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):

    list_display = [
        'product',
        'sku',
        'price',
        'discount_percentage',
        'stock',
        'is_default',
        'is_active',
    ]

    list_filter = [
        'is_active',
        'is_default',
    ]

    search_fields = [
        'product__name',
        'sku',
    ]

    filter_horizontal = [
        'options',
    ]

    inlines = [
        ProductImageInline,
    ]

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = [
        'name',
        'category',
        'brand',
        'default_price',
        'default_image',
        'is_active',
        'is_featured',
    ]

    readonly_fields = [
        'slug',
        'default_price',
        'default_image',
    ]

    @admin.display(description='Default Price')
    def default_price(self, obj):

        variant = obj.variants.filter(
            is_default=True,
            is_active=True
        ).first()

        if variant:
            return variant.discounted_price

        return '-'

    @admin.display(description='Default Image')
    def default_image(self, obj):

        variant = obj.variants.filter(
            is_default=True,
            is_active=True
        ).first()

        if not variant:
            return '-'

        image = variant.images.filter(
            is_primary=True
        ).first()

        if not image:
            return '-'

        return format_html(
            '<img src="{}" width="100" height="100" '
            'style="object-fit:contain;" />',
            image.image.url
        )