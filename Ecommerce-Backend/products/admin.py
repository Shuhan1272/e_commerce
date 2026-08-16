from django.contrib import admin

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
admin.site.register(Product)
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