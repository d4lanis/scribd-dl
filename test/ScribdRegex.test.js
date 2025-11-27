import * as scribdRegex from "../src/const/ScribdRegex.js"

describe('ScribdRegex', () => {
    describe('DOMAIN', () => {
        it('should match https://www.scribd.com', () => {
            expect('https://www.scribd.com'.match(scribdRegex.DOMAIN)).toBeTruthy()
        })
        it('should match http://www.scribd.com', () => {
            expect('http://www.scribd.com'.match(scribdRegex.DOMAIN)).toBeTruthy()
        })
        it('should match https://scribd.com', () => {
            expect('https://scribd.com'.match(scribdRegex.DOMAIN)).toBeTruthy()
        })
    })

    describe('DOCUMENT', () => {
        it('should match document url and extract ID', () => {
            const url = 'https://www.scribd.com/document/123456/Some-Title'
            const match = scribdRegex.DOCUMENT.exec(url)
            expect(match).toBeTruthy()
            expect(match[1]).toBe('123456')
        })

        it('should match doc url and extract ID', () => {
            const url = 'http://scribd.com/doc/987654'
            const match = scribdRegex.DOCUMENT.exec(url)
            expect(match).toBeTruthy()
            expect(match[1]).toBe('987654')
        })

        it('should match presentation url and extract ID', () => {
            const url = 'https://www.scribd.com/presentation/112233/My-Presentation'
            const match = scribdRegex.DOCUMENT.exec(url)
            expect(match).toBeTruthy()
            expect(match[1]).toBe('112233')
        })

        it('should match international url (es) and extract ID', () => {
            const url = 'https://es.scribd.com/document/346259083/VDG-P201-Englisch'
            const match = scribdRegex.DOCUMENT.exec(url)
            expect(match).toBeTruthy()
            expect(match[1]).toBe('346259083')
        })
    })

    describe('EMBED', () => {
        it('should match embed url and extract ID', () => {
            const url = 'https://www.scribd.com/embeds/55555'
            const match = scribdRegex.EMBED.exec(url)
            expect(match).toBeTruthy()
            expect(match[1]).toBe('55555')
        })
    })
})
