import * as am5 from '@amcharts/amcharts5';
import am5geodata_usaLow from '@amcharts/amcharts5-geodata/usaLow';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, NgZone, OnInit, PLATFORM_ID } from '@angular/core';

export const data2 = [
  {
    id: 'US-AL',
    state_name: 'Alabama',
  },
  {
    id: 'US-AK',
    state_name: 'Alaska',
  },
  {
    id: 'US-AZ',
    state_name: 'Arizona',
  },
  {
    id: 'US-AR',
    state_name: 'Arkansas',
  },
  {
    id: 'US-CA',
    state_name: 'California',
  },
  {
    id: 'US-CO',
    state_name: 'Colorado',
  },
  {
    id: 'US-CT',
    state_name: 'Connecticut',
  },
  {
    id: 'US-DE',
    state_name: 'Delaware',
  },
  {
    id: 'US-DC',
    state_name: 'District of Columbia',
  },
  {
    id: 'US-FL',
    state_name: 'Florida',
  },
  {
    id: 'US-GA',
    state_name: 'Georgia',
  },
  {
    id: 'US-HI',
    state_name: 'Hawaii',
  },
  {
    id: 'US-ID',
    state_name: 'Idaho',
  },
  {
    id: 'US-IL',
    state_name: 'Illinois',
  },
  {
    id: 'US-IN',
    state_name: 'Indiana',
  },
  {
    id: 'US-IA',
    state_name: 'Iowa',
  },
  {
    id: 'US-KS',
    state_name: 'Kansas',
  },
  {
    id: 'US-KY',
    state_name: 'Kentucky',
  },
  {
    id: 'US-LA',
    state_name: 'Louisiana',
  },
  {
    id: 'US-ME',
    state_name: 'Maine',
  },
  {
    id: 'US-MD',
    state_name: 'Maryland',
  },
  {
    id: 'US-MA',
    state_name: 'Massachusetts',
  },
  {
    id: 'US-MI',
    state_name: 'Michigan',
  },
  {
    id: 'US-MN',
    state_name: 'Minnesota',
  },
  {
    id: 'US-MS',
    state_name: 'Mississippi',
  },
  {
    id: 'US-MO',
    state_name: 'Missouri',
  },
  {
    id: 'US-MT',
    state_name: 'Montana',
  },
  {
    id: 'US-NE',
    state_name: 'Nebraska',
  },
  {
    id: 'US-NV',
    state_name: 'Nevada',
  },
  {
    id: 'US-NH',
    state_name: 'New Hampshire',
  },
  {
    id: 'US-NJ',
    state_name: 'New Jersey',
  },
  {
    id: 'US-NM',
    state_name: 'New Mexico',
  },
  {
    id: 'US-NY',
    state_name: 'New York',
  },
  {
    id: 'US-NC',
    state_name: 'North Carolina',
  },
  {
    id: 'US-ND',
    state_name: 'North Dakota',
  },
  {
    id: 'US-OH',
    state_name: 'Ohio',
  },
  {
    id: 'US-OK',
    state_name: 'Oklahoma',
  },
  {
    id: 'US-OR',
    state_name: 'Oregon',
  },
  {
    id: 'US-PA',
    state_name: 'Pennsylvania',
  },
  {
    id: 'US-RI',
    state_name: 'Rhode Island',
  },
  {
    id: 'US-SC',
    state_name: 'South Carolina',
  },
  {
    id: 'US-SD',
    state_name: 'South Dakota',
  },
  {
    id: 'US-TN',
    state_name: 'Tennessee',
  },
  {
    id: 'US-TX',
    state_name: 'Texas',
  },
  {
    id: 'US-UT',
    state_name: 'Utah',
  },
  {
    id: 'US-VT',
    state_name: 'Vermont',
  },
  {
    id: 'US-VA',
    state_name: 'Virginia',
  },
  {
    id: 'US-WA',
    state_name: 'Washington',
  },
  {
    id: 'US-WV',
    state_name: 'West Virginia',
  },
  {
    id: 'US-WI',
    state_name: 'Wisconsin',
  },
  {
    id: 'US-WY',
    state_name: 'Wyoming',
  },
];
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input('selectedState')
  set parentData(data: any) {
    if (data) {
      this.select = data2.find((x) => x?.state_name === data);

      if (this.root) {
        this.root.dispose();
      }

      this.getmethod(this.select?.id, this.select?.state_name);
    }
  }

  private root: am5.Root;
  select: any;
  array: any;

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    if (!this.select) {
      this.getmethod(this.select, this.select);
    }
  }

  getChart() {}

  getmethod(data, data2) {
    // Chart code goes in here
    this.browserOnly(() => {
      let root = am5.Root.new('chartdiv');
      root._logo.dispose();
      let chart = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: 'none',
          wheelY: 'none',
          wheelX: 'none',
          projection: am5map.geoAlbersUsa(),
        })
      );

      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);

      let polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_usaLow,
        })
      );
      // polygonSeries.mapPolygons.template.setup = function (target) {

      //     target.set('tooltip', am5.Tooltip.new(root, {}));

      // };

      polygonSeries.mapPolygons.template.setAll({
        tooltipText: '{name}',
        interactive: true,
        showTooltipOn: 'hover',
        templateField: 'polygonSettings',
        tooltip: am5.Tooltip.new(root, {}),
      });

      // var cursorPosition = cursor.getPrivate("positionX");

      // polygonSeries.mapPolygons.template.events.on("click", function(ev) {
      //
      // });
      // let backgroundSeries = chart.series.unshift(
      //   am5map.MapPolygonSeries.new(root, {})
      // );

      // backgroundSeries.mapPolygons.template.setAll({
      //   fill: am5.color(0xd4f1f9),
      //   stroke: am5.color(0xd4f1f9),
      // });

      // backgroundSeries.data.push({
      //   geometry: am5map.getGeoRectangle(90, 180, -90, -180)
      // });

      // let labelSeries = chart.series.unshift( am5map.MapSeries().new(root,{}));
      // let labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
      // labelTemplate.horizontalCenter = "middle";
      // labelTemplate.verticalCenter = "middle";
      // labelTemplate.fontSize = 10;
      // labelTemplate.nonScaling = true;
      // labelTemplate.interactionsEnabled = false;

      // polygonSeries.mapPolygons.template.events.on("inited", function () {
      //   polygonSeries.mapPolygons.each(function (polygon) {
      //     let label = labelSeries.mapImages.create();
      //     let state = polygon.dataItem.dataContext.id.split("-").pop();
      //     label.latitude = polygon.visualLatitude;
      //     label.longitude = polygon.visualLongitude;
      //     label.children.getIndex(0).text = state;
      //   });
      // });

      polygonSeries.mapPolygons.template.states.create('hover', {
        fill: am5.color(0x297273),
      });
      polygonSeries.mapPolygons.template.states.lookup('Colardo');

      polygonSeries.data.setAll([
        {
          id: data,
          polygonSettings: {
            fill: am5.color(0x297273),
          },
        },
      ]);
      if (data) {
        let footnote = chart.children.push(
          am5.Button.new(root, {
            dx: 580,
            dy: 150,
            label: am5.Label.new(root, {
              text: `${data2}`,
            }),
          })
        );
        footnote.get('background').setAll({
          fill: am5.color(0x297273),
        });
      }

      polygonSeries.mapPolygons.template.states.create('active', {
        fill: am5.color(0x297373),
      });

      // let label = chart.children.unshift(am5.Label.new(root, {
      //   text: "I am clickable!",
      //   background: am5.Rectangle.new(root, {
      //     fill: am5.color(0x297273),
      //     fillOpacity: 0
      //   })
      // }));

      // xAxis.get("renderer").labels.template.setAll({
      //   oversizedBehavior: "wrap",
      //   textAlign: "center",
      //   maxWidth: 150
      // });

      let zoomOut = root.tooltipContainer.children.push(
        am5.Button.new(root, {
          x: am5.p100,
          y: 0,
          centerX: am5.p100,
          centerY: 0,
          paddingTop: 18,
          paddingBottom: 18,
          paddingLeft: 12,
          paddingRight: 12,
          dx: -20,
          dy: 20,
          themeTags: ['zoom'],
          icon: am5.Graphics.new(root, {
            themeTags: ['button', 'icon'],
            strokeOpacity: 0.7,
            draw: function (display) {
              display.moveTo(0, 0);
              display.lineTo(12, 0);
            },
          }),
        })
      );

      zoomOut.hide();

      this.root = root;
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
