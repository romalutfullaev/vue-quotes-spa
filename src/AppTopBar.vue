<template>
    <div :ref="containerRef" class="layout-topbar">
        <a class="menu-button" @click="$emit('menubutton-click')">
            <i class="pi pi-bars"></i>
        </a>
        <ul ref="topbarMenu" class="topbar-menu">
            <li class="topbar-submenu topbar-resources-submenu">
                <a href="#" target="_blank"><span>DEMO link</span></a>
            </li>
            <li class="topbar-submenu topbar-resources-submenu">
                <a href="#" target="_blank"><span>Demo link</span></a>
            </li>
            <li class="topbar-submenu">
                <h6>v1.10.0</h6>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    emits: ['menubutton-click'],
    outsideClickListener: null,
    darkDemoStyle: null,
    data() {
        return {
            activeMenuIndex: null
        };
    },
    watch: {
        $route() {
            this.activeMenuIndex = null;
        }
    },
    scrollListener: null,
    container: null,
    mounted() {
        this.bindScrollListener();
    },
    beforeUnmount() {
        if (this.scrollListener) {
            this.unbindScrollListener();
        }
    },
    methods: {
        toggleMenu(event, index) {
            this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
            event.preventDefault();
        },
        onMenuEnter() {
            this.bindOutsideClickListener();
        },
        bindScrollListener() {
            if (!this.scrollListener) {
                if (this.container) {
                    this.scrollListener = () => {
                        if (window.scrollY > 0) this.container.classList.add('layout-topbar-sticky');
                        else this.container.classList.remove('layout-topbar-sticky');
                    };
                }
            }

            window.addEventListener('scroll', this.scrollListener);
        },
        unbindScrollListener() {
            if (this.scrollListener) {
                window.removeEventListener('scroll', this.scrollListener);
                this.scrollListener = null;
            }
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.activeMenuIndex != null && this.isOutsideTopbarMenuClicked(event)) {
                        this.activeMenuIndex = null;
                        this.unbindOutsideClickListener();
                    }
                };

                document.addEventListener('click', this.outsideClickListener);
            }
        },
        unbindOutsideClickListener() {
            if (this.outsideClickListener) {
                document.removeEventListener('click', this.outsideClickListener);
                this.outsideClickListener = null;
            }
        },
        isOutsideTopbarMenuClicked(event) {
            return !(this.$refs.topbarMenu.isSameNode(event.target) || this.$refs.topbarMenu.contains(event.target));
        },
        containerRef(el) {
            this.container = el;
        }
    }
};
</script>
