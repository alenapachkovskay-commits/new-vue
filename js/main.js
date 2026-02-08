Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
    <div class="product-image">
        <img v-bind:alt="altText" :src="image" />
    </div>
    <div class="product-info">
        <h1>{{ title }}</h1>
        <p>{{ description}}</p>

        <p v-if="inventory > 10 && inStock > 0">In stock</p>
        <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
        <p v-else :class="{'out-of-stock': !inStock }">Out of stock</p>
        <p>{{sale}}</p>
        <p>Shipping: {{ shipping }}</p>
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
        <div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId"
            :style="{ backgroundColor:variant.variantColor }" @mouseover="updateProduct(index)">
        </div>
        <div v-for="size in sizes" :key="size">
            <p>{{ size }}</p>
        </div>
        <a :href="link">More products like this</a>


        <div class="buttons">
            <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to
                cart</button>
            <button v-on:click="deleteFromCart">Delete from cart</button>
        </div>

        <div class="reviews">
            <h2>Reviews</h2>
            <p v-if="reviews.length === 0">There are no reviews yet.</p>
            <ul v-else>
                <li v-for="(review, index) in reviews" :key="index">
                    <strong>{{ review.name }}</strong>
                    <p>Rating: {{ review.rating }} / 5</p>
                    <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>
        <product-review @review-submitted="addReview"></product-review>
    </div>
</div>`,

    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            description: "A pair of warm, fuzzy socks",
            image: "./assets/vmSocks-green-onWhite.jpg",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inStock: true,
            inventory: 100,
            onSale: true,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: [],
        };
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
        deleteFromCart() {
            this.$emit('delete-from-cart',
                this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        addReview(review) {
            this.reviews.push(review);
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' ' + 'On sale';
            } else {
                return this.brand + ' ' + this.product + ' ' + 'Not on sale((';
            }
        },
        shipping() {
            return this.premium ? "Free" : 2.99;
        },
    },
})
Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>`
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart(id) {
            const index = this.cart.indexOf(id);
            if (index !== -1) {
                this.cart.splice(index, 1);
            }
        },
    }
})
Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <!-- Вывод ошибок -->
    <p v-if="errors.length" class="error">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name" required>
    </p>

    <p>
      <label for="review">Review:</label>
      <textarea id="review" v-model="review" placeholder="Write your review..."></textarea>
    </p>

    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option disabled value="">Select rating</option>
        <option :value="5">5 (Excellent)</option>
        <option :value="4">4 (Good)</option>
        <option :value="3">3 (Average)</option>
        <option :value="2">2 (Poor)</option>
        <option :value="1">1 (Terrible)</option>
      </select>
    </p>

    <p>
      <input type="submit" value="Submit Review">
    </p>
  </form>
  `,
    data() {
        return {
            name: '',
            review: '',
            rating: null,
            errors: []
        };
    },
    metods: {
        onSubmit() {
            this.errors = [];
            if (!this.name) this.errors.push("Name is required.");
            if (!this.review) this.errors.push("Review is required.");
            if (this.rating === null || this.rating === '') this.errors.push("Rating is required.");

            if (this.errors.length === 0) {
                const productReview = {
                    name: this.name,
                    review: this.review,
                    rating: Number(this.rating)
                };
                this.$emit('review-submitted', productReview);

                this.name = '';
                this.review = '';
                this.rating = null;
            }
        }
    }
})



